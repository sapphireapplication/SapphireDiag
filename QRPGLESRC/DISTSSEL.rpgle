000100070317     F**********************************************************************    000200980821     F*�F i l e s                                                               000300980821     F**********************************************************************    000400070213     FDISTSSLD  CF   E             WORKSTN                                      000500070201     F                                     SFILE(ZZSFL:SFLRRN)                  000600070213     FDISTS     IF   E           K DISK                                         001100070201     C*******************************************************************       001200070201     C*�M a i n l i n e   C o d e                                               001300070201     C*******************************************************************       001400070201     C*�Build subfile                                                           001500070201     C                   EXSR      ZBUILD                                       001501110922     C***                EXFMT     CFSTSCR                                      001600070201     C*�Until Exit/Cancel                                                       001700070201     C     *IN03         DOWEQ     '0'                                          001800070201     C     *IN12         ANDEQ     '0'                                          001900070201     C*�Display screen                                                          002000070201     C                   EXFMT     ZZCTL                                        002100070201     C*�If Exit/Cancel                                                          002200070201     C     *IN03         IFEQ      '1'                                          002300070201     C     *IN12         OREQ      '1'                                          002400070201     C                   LEAVE                                                  002500070201     C                   ENDIF                                                  002600070201     C*�If selection made                                                       002700070201     C                   READC     ZZSFL                                  30    002800070201     C     *IN30         IFEQ      '0'                                          002801110922     C****               MOVE      DSNAME        PNAME                          002900070213     C                   MOVEL     DSDCDE        PCODE                          003000070213     C                   MOVEL     DNAME         PARNAM                         003100070201     C                   LEAVE                                                  003200070201     C                   ENDIF                                                  003300070201     C*�End: Until Exit/Cancel                                                  003400070201     C                   ENDDO                                                  003500070201     C*�Terminate program                                                       003600070201     C                   MOVE      '1'           *INLR                          003700070201     C                   RETURN                                                 003800070201     C*******************************************************************       003900070201     C* L o g i c a l   E n d   o f   P r o g r a m                             004000070201     C*******************************************************************       004100070201     C*******************************************************************       004200070201     C     ZBUILD        BEGSR                                                  004300070201     C******************************************************************        004400070201     C*�Subroutine: Build subfile                                               004500070201     C******************************************************************        004600070201     C                   MOVE      *ZEROS        SFLRRN            5 0          004700070213     C     *LOVAL        SETLL     DISTS                                        004800070213     C                   READ(N)   DISTS                                  31    004900070201     C     *IN31         DOWEQ     '0'                                          005000070201     C                   ADD       1             SFLRRN                         005100070201     C                   WRITE     ZZSFL                                        005200070213     C                   READ(N)   DISTS                                  31    005300070201     C                   ENDDO                                                  005400070201     C     SFLRRN        IFGT      0                                            005500070201     C                   MOVE      '1'           *IN31                          005600070201     C                   ENDIF                                                  005700070201     C                   ENDSR                                                  005800070201     C*******************************************************************       005900070201     C*******************************************************************       006000050722     C*�N o n - e x e c u t a b l e   C o d e                                   006100070201     C*******************************************************************       006200050801     C*�*ENTRY Parameter List                                                   006300070201     C     *ENTRY        PLIST                                                  006400070213     C                   PARM                    PCODE             2            006500070213     C                   PARM                    PARNAM           34            006600050722     C**********************************************************************    